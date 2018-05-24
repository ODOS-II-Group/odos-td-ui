package gov.dhs.uscis.odos.cucumber;

import org.junit.runner.RunWith;
import org.springframework.test.context.ActiveProfiles;

import cucumber.api.CucumberOptions;

@RunWith(SpringProfileCucumber.class)
@CucumberOptions(plugin = "pretty", features = "src/test/features")
@ActiveProfiles("test, no-liquibase")
public class CucumberTest {

}
